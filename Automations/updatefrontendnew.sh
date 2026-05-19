#!/bin/bash

# EC2 Instance ID
INSTANCE_ID="i-030da7d31a1dbbffc"   # Change if needed

# Fetch Public IP from AWS EC2
ipv4_address=$(aws ec2 describe-instances \
--instance-ids $INSTANCE_ID \
--query 'Reservations[0].Instances[0].PublicIpAddress' \
--output text)

# Frontend .env file path
file_to_find="../frontend/.env.docker"

# Check if file exists
if [ -f "$file_to_find" ]; then

    # Read current VITE_API_PATH
    current_url=$(grep "^VITE_API_PATH=" "$file_to_find")

    # Create new API URL
    new_url="VITE_API_PATH=\"http://${ipv4_address}:31100\""

    # Compare old and new values
    if [[ "$current_url" != "$new_url" ]]; then

        # Update the value
        sed -i "s|^VITE_API_PATH=.*|$new_url|g" "$file_to_find"

        echo "VITE_API_PATH updated successfully."
        echo "New URL: http://${ipv4_address}:31100"

    else
        echo "No changes required."
    fi

else
    echo "ERROR: .env.docker file not found."
fi