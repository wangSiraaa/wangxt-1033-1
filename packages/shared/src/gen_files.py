import os

base = "/Users/mingyuan/workspace/sihuo/wangxtw3/1033/packages/shared/src"
dto_dir = os.path.join(base, "dto")
utils_dir = os.path.join(base, "utils")

os.makedirs(dto_dir, exist_ok=True)
os.makedirs(utils_dir, exist_ok=True)

files = {}
