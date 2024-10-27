#!/bin/bash
set -euo pipefail

deactivate
cd /home/
flask run --host=0.0.0.0 --port 5000