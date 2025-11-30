import bcrypt
import secrets


users = [
    'admin_manager',
    'staff_sales1',
    'doctor_tam',
    'doctor_thao',
    'staff_kho',
    'customer_an',
    'customer_binh',
    'customer_cuong',
    'customer_dung',
    'customer_em'
]

for user in users:
    password = secrets.token_urlsafe(12)
    hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt(10)).decode()
    print(f"{user}: {password} -> {hash}")