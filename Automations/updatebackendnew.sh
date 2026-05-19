#!/bin/bash

# EC2 Instance ID
INSTANCE_ID="i-030da7d31a1dbbffc"

# Get EC2 Public IP
ipv4_address=$(aws ec2 describe-instances \
--instance-ids $INSTANCE_ID \
--query 'Reservations[0].Instances[0].PublicIpAddress' \
--output text)

# .env file path
file_to_find="../backend/.env.docker"

# Check file exists
if [ -f "$file_to_find" ]; then

    # Read existing FRONTEND_URL
    current_url=$(grep "^FRONTEND_URL=" "$file_to_find")

    # New URL
    new_url="FRONTEND_URL=\"http://${ipv4_address}:5173\""

    # Compare and update
    if [[ "$current_url" != "$new_url" ]]; then

        sed -i "s|^FRONTEND_URL=.*|$new_url|g" "$file_to_find"

        echo "Updated FRONTEND_URL"
        echo "$new_url"

    else
        echo "No changes needed."
    fi

else
    echo "ERROR: File not found."
fi




# Example .env.docker
# PORT=5000
# DB_URL=mongodb://mongo:27017/app
# JWT_SECRET=test123
# FRONTEND_URL="http://13.233.45.100:5173"
# Run Script


# chmod +x updatebackendnew.sh
# ./updatebackendnew.sh