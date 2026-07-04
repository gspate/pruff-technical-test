#!/bin/sh
npx prisma db push
HOSTNAME="0.0.0.0" node server.js
