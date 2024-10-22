import os
import sys


def create_app_route(route_name):
    # Capitalize the route name for usage in component names
    capitalized_route = route_name.capitalize()

    # Define the base directory and file paths
    base_dir = os.path.join("app", "(root)", route_name)
    page_file = os.path.join(base_dir, "page.tsx")
    client_component_file = os.path.join(base_dir, f"{capitalized_route}Client.tsx")

    if os.path.isdir(base_dir):
        print("App route already exists.")
        sys.exit()

    # Create the directory if it doesn't exist
    os.makedirs(base_dir, exist_ok=True)

    # Create content for page.tsx with 2 spaces indentation
    page_content = f"""
  import {{ {capitalized_route}Client }} from './{capitalized_route}Client';

  export default function {capitalized_route}Page() {{
    return <{capitalized_route}Client />;
  }}
    """.strip()

    # Create content for [RouteName]Client.tsx with an arrow function and 2 spaces indentation
    client_content = f"""
  'use client';

  import React from 'react';

  const {capitalized_route}Client = () => {{
    return (
      <div>
        <h1>{capitalized_route} Client Component</h1>
      </div>
    );
  }}

  export default {capitalized_route}Client;
    """.strip()

    # Write the content to page.tsx
    with open(page_file, "w") as f:
        f.write(page_content)

    # Write the content to [RouteName]Client.tsx
    with open(client_component_file, "w") as f:
        f.write(client_content)

    print(
        f"Successfully created {route_name} route with page.tsx and {capitalized_route}Client.tsx"
    )


if __name__ == "__main__":
    # Ask for user input via command line
    route_name = input("Enter the route name: ").strip()
    if route_name:
        create_app_route(route_name)
    else:
        print("Route name cannot be empty!")
