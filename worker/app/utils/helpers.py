import hashlib
import hmac
from datetime import datetime


def generate_job_id() -> str:
    """Generate unique job ID"""
    import uuid
    return str(uuid.uuid4())


def verify_webhook_signature(payload: bytes, signature: str, secret: str) -> bool:
    """Verify webhook signature (e.g., from Supabase or Midtrans)"""
    expected_signature = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(expected_signature, signature)


def format_duration(seconds: float) -> str:
    """Format duration in human-readable format"""
    if seconds < 60:
        return f"{seconds:.1f}s"
    elif seconds < 3600:
        minutes = int(seconds // 60)
        secs = int(seconds % 60)
        return f"{minutes}m {secs}s"
    else:
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        return f"{hours}h {minutes}m"


def sanitize_filename(filename: str) -> str:
    """Sanitize filename for safe storage"""
    import re
    # Remove special characters
    filename = re.sub(r'[^\w\s-]', '', filename)
    # Replace spaces with underscores
    filename = re.sub(r'[\s]+', '_', filename)
    return filename.lower()
