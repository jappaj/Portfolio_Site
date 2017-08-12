from sys import argv
from json import dumps, loads
import subprocess

def main():
    if len(argv) < 3:
        print("Not enough arguments")
    else:
        filename = argv[1]
        base_mustache_string = argv[2]

    with open(filename, 'r') as f:
        json_body = loads(f.read().strip())

        run_mustache_loop(json_body, base_mustache_string)

def create_mustache_cmd(base_string, json_filename, output_filename):
    new_str = base_string % (json_filename, output_filename)

    return ["powershell.exe"] + [new_str]

def run_mustache_loop(dict_in, base_command):
    static_data = {}

    for k, v in dict_in.iteritems():
        if k != "projects":
            static_data[k] = v

    for project in dict_in["projects"]:
        new_project_dict = static_data

        # copy carousel and title
        for k, v in project.iteritems():
            new_project_dict[k] = v
        
        json_out = dumps(new_project_dict)

        temp_filename = "mustache_temp.json"
        output_filename = project["projectTitle"].replace(" ", "_") + ".html"
        with open(temp_filename, 'w') as f:
            f.write(json_out)

        # flush file
        call_args = create_mustache_cmd(base_command, temp_filename, output_filename)

        # if this fails, end the program
        subprocess.check_call(call_args, shell=True)

if __name__ == "__main__":
    main()
