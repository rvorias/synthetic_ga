from subprocess import Popen
import time
import sys
import os

N_OUTER_LOOPS = 10000
N_INNER_LOOPS = 10000

if len(sys.argv) > 0:
    NUM_WORKERS = int(sys.argv[1])

commands = [f"node {os.getcwd()}/synth.js"] * NUM_WORKERS

for i in range(N_OUTER_LOOPS):
    print(i)
    start = time.time()

    procs = [ Popen(i, shell=True) for i in commands ]
    for p in procs:
        p.wait()

    print(f"throughput: {N_INNER_LOOPS*len(commands)/(time.time()-start)} it/s")

    if os.path.isfile("./8.txt"):
        break