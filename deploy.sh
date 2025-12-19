#!/bin/bash

# ============================================
# HFDX DEX - AWS S3 Deployment Script
# ============================================
#
# This script deploys the HFDX DEX to AWS S3
# and optionally invalidates the CloudFront cache.
#
# Prerequisites:
#   - AWS CLI installed and configured
#   - Proper IAM permissions for S3 and CloudFront
#
# Usage:
#   ./deploy.sh
#   ./deploy.sh --invalidate
#
# ============================================

set -e  # Exit on any error

# Configuration
S3_BUCKET="hfdx-dex"
CLOUDFRONT_DISTRIBUTION_ID=""  # Add your CloudFront distribution ID here
AWS_REGION="us-east-1"         # Change to your preferred region

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Print header
echo ""
echo "============================================"
echo "  HFDX DEX - AWS S3 Deployment"
echo "============================================"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    log_error "AWS CLI is not installed. Please install it first."
    log_info "Visit: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check AWS credentials
log_info "Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    log_error "AWS credentials not configured. Run 'aws configure' first."
    exit 1
fi
log_success "AWS credentials verified"

# Get current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

log_info "Deploying from: $SCRIPT_DIR"

# Check if S3 bucket exists, create if not
log_info "Checking S3 bucket: $S3_BUCKET"
if ! aws s3api head-bucket --bucket "$S3_BUCKET" 2>/dev/null; then
    log_warning "Bucket does not exist. Creating bucket: $S3_BUCKET"
    
    if [ "$AWS_REGION" = "us-east-1" ]; then
        aws s3api create-bucket --bucket "$S3_BUCKET" --region "$AWS_REGION"
    else
        aws s3api create-bucket --bucket "$S3_BUCKET" --region "$AWS_REGION" \
            --create-bucket-configuration LocationConstraint="$AWS_REGION"
    fi
    
    log_success "Bucket created: $S3_BUCKET"
    
    # Enable static website hosting
    log_info "Enabling static website hosting..."
    aws s3 website "s3://$S3_BUCKET/" --index-document index.html --error-document index.html
    log_success "Static website hosting enabled"
    
    # Set bucket policy for public read access
    log_info "Setting bucket policy for public access..."
    aws s3api put-bucket-policy --bucket "$S3_BUCKET" --policy '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::'$S3_BUCKET'/*"
            }
        ]
    }'
    log_success "Bucket policy applied"
else
    log_success "Bucket exists: $S3_BUCKET"
fi

# Sync files to S3
log_info "Syncing files to S3..."

# Sync with appropriate content types and caching
aws s3 sync . "s3://$S3_BUCKET" \
    --exclude ".git/*" \
    --exclude ".gitignore" \
    --exclude "*.sh" \
    --exclude "node_modules/*" \
    --exclude "lws.config.*" \
    --exclude ".DS_Store" \
    --exclude "*.md" \
    --exclude "package*.json" \
    --exclude "yarn.lock" \
    --delete

# Set specific cache headers for different file types
log_info "Setting cache headers..."

# HTML files - no cache (always fresh)
aws s3 cp "s3://$S3_BUCKET/index.html" "s3://$S3_BUCKET/index.html" \
    --metadata-directive REPLACE \
    --cache-control "no-cache, no-store, must-revalidate" \
    --content-type "text/html" \
    2>/dev/null || true

# CSS files - cache for 1 day
aws s3 cp "s3://$S3_BUCKET/custom.css" "s3://$S3_BUCKET/custom.css" \
    --metadata-directive REPLACE \
    --cache-control "public, max-age=86400" \
    --content-type "text/css" \
    2>/dev/null || true

log_success "Files synced to S3"

# Print S3 website URL
S3_WEBSITE_URL="http://$S3_BUCKET.s3-website-$AWS_REGION.amazonaws.com"
log_info "S3 Website URL: $S3_WEBSITE_URL"

# Invalidate CloudFront cache if requested and distribution ID is set
if [[ "$1" == "--invalidate" ]] && [[ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]]; then
    log_info "Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
        --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
        --paths "/*"
    log_success "CloudFront cache invalidation initiated"
elif [[ "$1" == "--invalidate" ]]; then
    log_warning "CloudFront distribution ID not set. Skipping cache invalidation."
    log_info "Set CLOUDFRONT_DISTRIBUTION_ID in this script to enable invalidation."
fi

# Print summary
echo ""
echo "============================================"
echo "  Deployment Complete!"
echo "============================================"
echo ""
log_success "HFDX DEX has been deployed successfully!"
echo ""
echo "  S3 Bucket:     $S3_BUCKET"
echo "  S3 Website:    $S3_WEBSITE_URL"
echo "  Production:    https://app.hfdx.xyz"
echo ""
echo "  Next steps:"
echo "    1. Set up CloudFront distribution (if not done)"
echo "    2. Configure custom domain (app.hfdx.xyz)"
echo "    3. Add SSL certificate via ACM"
echo ""
log_info "For CloudFront cache invalidation, run: ./deploy.sh --invalidate"
echo ""

