#!/usr/bin/env python3

import os
import requests
import calendar
from datetime import datetime
from github import Github
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

TOKEN = os.getenv('GITHUB_TOKEN')
if not TOKEN:
    raise Exception("GITHUB_TOKEN not found in environment variables")
g = Github(TOKEN)

def run_query(query, variables):
    headers = {"Authorization": f"Bearer {TOKEN}"}
    request = requests.post('https://api.github.com/graphql', json={'query': query, 'variables': variables}, headers=headers)
    if request.status_code == 200:
        return request.json()
    else:
        raise Exception(f"Query failed to run by returning code of {request.status_code}. {query}")

def get_contributions(username, year):
    query = """
    query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
            contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                    weeks {
                        contributionDays {
                            date
                            contributionCount
                        }
                    }
                }
            }
        }
    }
    """
    from_date = f"{year}-01-01T00:00:00Z"
    to_date = f"{year}-12-31T23:59:59Z"
    variables = {"username": username, "from": from_date, "to": to_date}
    result = run_query(query, variables)
    weeks = result['data']['user']['contributionsCollection']['contributionCalendar']['weeks']
    return [day for week in weeks for day in week['contributionDays']]

def contributions_to_grid(year, contributions):
    # Create a 7x52 grid
    grid = [[0]*7 for _ in range(52)]

    # Count contributions per week
    for contribution in contributions:
        date = datetime.strptime(contribution['date'], "%Y-%m-%d")
        if date.year == year:
            week_number = date.isocalendar()[1] - 1  # week numbers start from 1
            day_of_week = date.weekday()  # Monday is 0 and Sunday is 6
            grid[week_number][day_of_week] += contribution['contributionCount']

    return grid

def normalize(grid):
    normalized_contributions = []

    for row in grid:
        # Remove zero values
        filtered_row = [value for value in row if value != 0]

        # Sort in descending order
        sorted_row = sorted(filtered_row, reverse=True)

        normalized_contributions.append(sorted_row)

    return normalized_contributions

def main():
    username = input("Enter your GitHub username: ")
    current_year = int(input("Enter the year: "))

    contributions = get_contributions(username, current_year)
    grid = contributions_to_grid(current_year, contributions)

    print(normalize(grid))


if __name__ == "__main__":
    main()
