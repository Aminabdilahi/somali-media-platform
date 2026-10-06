up:        ; docker compose up --build
down:      ; docker compose down
test:      ; docker compose run --rm api pytest -q
migrate:   ; docker compose run --rm api alembic upgrade head
keys:      ; @python3 -c "import secrets;from cryptography.fernet import Fernet;print('SECRET_KEY='+secrets.token_urlsafe(48));print('FERNET_KEY='+Fernet.generate_key().decode())"
