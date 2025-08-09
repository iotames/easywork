## Odoo实现JWT

- 第三方包：https://apps.odoo.com/apps/modules/17.0/auth_jwt
- https://github.com/OCA/server-auth


## 核心代码

```python
# controllers/main.py
import jwt
from odoo import http
from odoo.http import request

SECRET_KEY = "YOUR_SECRET_KEY"

class JWTSSOController(http.Controller):

    @http.route('/sso/login', type='http', auth='public', csrf=False)
    def sso_login(self, token=None, **kwargs):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            login = payload.get('login')

            user = request.env['res.users'].sudo().search([('login', '=', login)], limit=1)
            if user:
                request.session.uid = user.id  # 模拟登录
                # werkzeug.utils.redirect('/web')
                return http.redirect_with_hash('/')  # 登录成功后跳转
            else:
                return "User not found", 404

        except jwt.ExpiredSignatureError:
            return "Token expired", 401
        except jwt.InvalidTokenError:
            return "Invalid token", 401
```
