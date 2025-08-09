import base64
import hashlib
import hmac
import json
import time
from typing import Dict, Any, Optional, Tuple

class JWTHandler:
    def __init__(
        self,
        secret_key: str,
        algorithm: str = "HS256",
        expiration_seconds: int = 3600
    ):
        self.secret_key = secret_key.encode('utf-8')
        self.algorithm = algorithm.upper()
        self.expiration_seconds = expiration_seconds

    def _base64url_encode(self, data: bytes) -> str:
        """Base64Url编码实现"""
        return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')

    def _base64url_decode(self, text: str) -> bytes:
        """Base64Url解码实现（修复版）"""
        # 先将URL安全字符还原为标准Base64字符
        standard_text = text.replace('-', '+').replace('_', '/')
        
        # 计算需要补充的填充字符数量
        missing_padding = len(standard_text) % 4
        if missing_padding:
            standard_text += '=' * (4 - missing_padding)
        # 执行解码
        return base64.urlsafe_b64decode(standard_text)

    def _create_signature(self, header: str, payload: str) -> str:
        """生成签名"""
        message = f"{header}.{payload}".encode('utf-8')
        if self.algorithm == "HS256":
            return self._base64url_encode(
                hmac.new(self.secret_key, message, hashlib.sha256).digest()
            )
        # 可扩展其他算法（如RS256需要RSA私钥）
        raise NotImplementedError("当前仅支持HS256算法")

    def generate_token(self, payload: Dict[str, Any]) -> str:
        """生成JWT令牌"""
        # 构建标准声明
        now = int(time.time())
        standard_payload = {
            "alg": self.algorithm,
            "typ": "JWT",
            "iat": now,
            "exp": now + self.expiration_seconds
        }
        
        # 合并自定义载荷
        combined_payload = {**payload, **standard_payload}
        
        # 编码各部分
        encoded_header = self._base64url_encode(json.dumps(standard_payload).encode('utf-8'))
        encoded_payload = self._base64url_encode(json.dumps(combined_payload).encode('utf-8'))
        signature = self._create_signature(encoded_header, encoded_payload)
        
        return f"{encoded_header}.{encoded_payload}.{signature}"

    def decode_token(self, token: str) -> Dict[str, Any]:
        """解码并验证JWT令牌"""
        try:
            header_enc, payload_enc, signature_enc = token.split('.')
            signature = self._base64url_decode(signature_enc)
            
            # 验证签名
            expected_signature = self._create_signature(header_enc, payload_enc)
            if not hmac.compare_digest(signature, self._base64url_decode(expected_signature)):
                raise ValueError("签名验证失败")
            
            # 解码载荷
            payload = json.loads(self._base64url_decode(payload_enc).decode('utf-8'))
            print(payload)
            
            # 验证时间声明
            now = int(time.time())
            if payload.get("exp") < now:
                raise ValueError("Token已过期")
            if payload.get("nbf") and payload["nbf"] > now:
                raise ValueError("Token未生效")
            
            return payload
        except (ValueError, json.JSONDecodeError) as e:
            raise ValueError(f"无效的Token: {str(e)}")

# 使用示例
if __name__ == "__main__":
    # 初始化处理器
    jwt_handler = JWTHandler(secret_key="A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6")
    
    # 生成token
    user_payload = {
        "user_id": 1001,
        "username": "admin",
        "role": "SUPERUSER"
    }
    token = jwt_handler.generate_token(user_payload)
    print(f"Generated Token: {token}")
    
    # 解码token
    try:
        decoded = jwt_handler.decode_token(token)
        print(f"Decoded Payload: {decoded}")
    except ValueError as e:
        print(f"Decode Error: {str(e)}")