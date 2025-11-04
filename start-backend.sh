#!/bin/bash
export ENCORE_INSTALL="/home/runner/.encore"
export PATH="$ENCORE_INSTALL/bin:$PATH"
cd backend
encore run
