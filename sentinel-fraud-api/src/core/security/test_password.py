from src.core.security.password import (
    hash_password,
    verify_password,
)

password = "123456"

hashed = hash_password(password)

print(hashed)

print(
    verify_password(
        "123456",
        hashed,
    )
)
