## JWT介绍

JWT（JSON Web Token）是一种开放标准（RFC 7519），它定义了一种紧凑且自包含的 JSON 对象，用于在各方之间传递安全信息。JWT 由三部分组成：头部（header），有效载荷（payload），和签名（signature）。

示例：https://gitee.com/zhijiantianya/ruoyi-vue-pro


## 引入JWT依赖

`yudao-framework/yudao-common/pom.xml`:

```xml
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>

```

## 添加JWT类文件

```bash
vim yudao-framework/yudao-common/src/main/java/cn/iocoder/yudao/framework/common/util/json/JsonWebToken.java
```

java文件内容：

```java
package cn.iocoder.yudao.framework.common.util.json;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
// import org.springframework.beans.factory.annotation.Value;

public class JsonWebToken {

    private static String jwtSecret;

    // @Value("${yudao.security.jwt-secret}")
    public static void setJwtSecret(String secret) {
        JsonWebToken.jwtSecret = secret;
    }

    /**
     * 解析JWT，获取userId
     * @param token JWT字符串
     * @return userId
     */
    public static Long parseUserId(String token) {
        Claims claims = parseClaims(token);
        Object userIdObj = claims.get("userId");
        if (userIdObj == null) {
            return null;
        }
        return Long.valueOf(userIdObj.toString());
    }

    /**
     * 解析JWT，获取username
     * @param token JWT字符串
     * @return username
     */
    public static String parseUsername(String token) {
        Claims claims = parseClaims(token);
        Object usernameObj = claims.get("username");
        if (usernameObj == null) {
            return null;
        }
        return usernameObj.toString();
    }

    private static Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(jwtSecret.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}

```

## 添加表单字段

```bash
vim yudao-module-system/yudao-module-system-biz/src/main/java/cn/iocoder/yudao/module/system/controller/admin/auth/vo/AuthLoginReqVO.java
```

```java
    @Schema(description = "使用JWT做单点登录的Token", requiredMode = Schema.RequiredMode.NOT_REQUIRED, example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInRlbXAiOnRydWUsInNpZ25JblRpbWUiOjE3NTA3NDg0NDA4MDgsImlhdCI6MTc1MDg0NDM5OSwiZXhwIjoxNzUwOTMwNzk5LCJqdGkiOiI5MGI3ZmZjOS0wMGYxLTQ3NTAtYmFkNS0zY2I0NTNjZGI2ZjQifQ.s8OzRrtjIMrW1eXkp8OP3t6lnM69V64_BnUuNJFYIjg")
    private String token;
```

## 添加业务处理逻辑

```bash
vim yudao-module-system/yudao-module-system-biz/src/main/java/cn/iocoder/yudao/module/system/service/auth/AdminAuthServiceImpl.java
```

```java
import cn.iocoder.yudao.framework.common.util.json.JsonWebToken;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AdminAuthServiceImpl implements AdminAuthService {

    /**
     * JWT 密钥
     */
    @Value("${yudao.security.jwt-secret}")
    private String jwtSecret;

    @PostConstruct
    public void initJwtSecret() {
        JsonWebToken.setJwtSecret(jwtSecret);
    }

    @Override
    public AuthLoginRespVO login(AuthLoginReqVO reqVO) {
        // 新增：优先判断token
        String token = reqVO.getToken();
        if (cn.hutool.core.util.StrUtil.isNotBlank(token) && token.length() > 17) {
            AdminUserDO user;
            String username = JsonWebToken.parseUsername(token);
            if (username == null) {
                Long userId = JsonWebToken.parseUserId(token);
                user = userService.getUser(userId);
                if (user == null) {
                    throw exception(USER_NOT_EXISTS);
                }
            } else {
                user = userService.getUserByUsername(username);
                if (user == null) {
                    throw exception(USER_NOT_EXISTS);
                }
            }
            return createTokenAfterLoginSuccess(user.getId(), user.getUsername(), LoginLogTypeEnum.LOGIN_USERNAME);
        }

        // 校验验证码
        validateCaptcha(reqVO);

        // 使用账号密码，进行登录
        AdminUserDO user = authenticate(reqVO.getUsername(), reqVO.getPassword());

        // 如果 socialType 非空，说明需要绑定社交用户
        if (reqVO.getSocialType() != null) {
            socialUserService.bindSocialUser(new SocialUserBindReqDTO(user.getId(), getUserType().getValue(),
                    reqVO.getSocialType(), reqVO.getSocialCode(), reqVO.getSocialState()));
        }
        // 创建 Token 令牌，记录登录日志
        return createTokenAfterLoginSuccess(user.getId(), reqVO.getUsername(), LoginLogTypeEnum.LOGIN_USERNAME);
    }

}

```

## 修改配置文件

```bash
# vim yudao-server/src/main/resources/application.yaml
vim yudao-server/src/main/resources/application-local.yaml
```

```yaml
server:
  port: 48080
yudao:
  captcha:
    enable: false # 本地环境，暂时关闭图片验证码，方便登录等接口的测试；
  security:
    # HS256 算法要求密钥长度至少 256 位（32 字节），your-secret-key密钥只有 120 位（15 字节）。
    jwt-secret: A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6
```
