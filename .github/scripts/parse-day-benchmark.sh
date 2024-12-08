#!/bin/bash

README_FILE="$1"

# Extract the ## Answer section and dynamically find "time (~)" column
awk '
  BEGIN { column_index = -1 }
  
  # Start processing when the ## Answer section is found
  /^## Answer$/ { in_answer_section = 1; next }

  # Exit the section if another heading is encountered
  /^## / && in_answer_section { in_answer_section = 0 }

  # Process lines inside the ## Answer section
  in_answer_section {
    # If column_index is unset, find the index of "time (~)" in the header row
    if (column_index == -1 && $0 ~ /^[|]/) {
      split($0, headers, "|")
      for (i = 1; i <= length(headers); i++) {
        gsub(/^[[:space:]]+|[[:space:]]+$/, "", headers[i]) # Trim spaces
        if (headers[i] == "time (~)") {
          column_index = i
          break
        }
      }
      next
    }
    
    # Process rows with valid table data
    if (column_index != -1 && $0 ~ /^[|]/) {
      split($0, fields, "|")
      time_field = fields[column_index]
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", time_field) # Trim spaces
      if (time_field != "" && time_field !~ /^-+$/) {
        times = (times == "" ? time_field : times " \\| " time_field)
      }
    }
  }

  # Print the extracted "time (~)" values at the end
  END {
    if (times != "") {
      print times
    }
  }
' "$README_FILE"
