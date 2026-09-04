import subprocess, os

# Let's search if there is any other file with size ~3.6MB or original bb3 in cache / git / artifacts
res = subprocess.run(['find', '/.aistudio', '-name', '*bb3*'], capture_output=True, text=True)
print('search 1:', res.stdout)

res2 = subprocess.run(['find', '/tmp', '-name', '*bb3*'], capture_output=True, text=True)
print('search 2:', res2.stdout)

res3 = subprocess.run(['find', '/root', '-name', '*bb3*'], capture_output=True, text=True)
print('search 3:', res3.stdout)
