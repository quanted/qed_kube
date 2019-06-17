import sys
import os
import platform
import getopt
import shutil
import yaml


# if local, check os and set paths according to the os
# if aws, load aws_volumes.json to set volumesIDs (AWS EBS)
# if azure, load azure_volumes.json to set volume details (azureDisk)

class KubeSetup:

    deploy = "local"
    pwd = "/"

    def __init__(self, deploy):
        print("Starting qed_kube setup procedure...")
        self.deploy = deploy
        if self.deploy == "local":
            self.pwd = os.getcwd()
            self.copy_files()
            self.volumes_setup()
        elif self.deploy == "aws":
            print("aws deploy setup not yet implemented.")
        elif self.deploy == "azure":
            print("azure deploy setup not yet implemented.")

    def copy_files(self):
        print("Restoring pre-deploy .yml files...")
        backup_dir = "backups"
        files = os.listdir(backup_dir)
        for f in files:
            if ".yml" in f:
                backup_path = os.path.join(backup_dir, f)
                file_path = os.path.join(self.pwd, f)
                if os.path.exists(file_path):
                    os.remove(file_path)
                shutil.copyfile(backup_path, file_path)

    def volumes_setup(self):
        print("Setting up qed_kube for {}".format(platform.system()))
        print("Current working directory: {}".format(self.pwd))
        dir_files = os.listdir(self.pwd)
        for f in dir_files:
            if "persistentVolume" in f or "deployment" in f or "statefulset" in f:
                yml_file = None
                with open(f, 'r') as stream:
                    try:
                        yml_file = yaml.safe_load(stream)
                    except yaml.YAMLError as ymlerr:
                        print(ymlerr)
                    if yml_file["kind"] == "Deployment":
                        i = 0
                        if "volumes" in yml_file["spec"]["template"]["spec"]:
                            for v in yml_file["spec"]["template"]["spec"]["volumes"]:
                                if "hostPath" in v:
                                    yf = v["hostPath"]["path"]
                                    yf_path = os.path.abspath(os.path.join(self.pwd, yf))
                                    yml_file["spec"]["template"]["spec"]["volumes"][i]["hostPath"]["path"] = yf_path
                                    self.check_dir(yf_path)
                                i += 1
                    elif yml_file["kind"] == "PersistentVolume":
                        yf = yml_file["spec"]["hostPath"]["path"]
                        yf_path = os.path.abspath(os.path.join(self.pwd, yf))
                        yml_file["spec"]["hostPath"]["path"] = yf_path
                        self.check_dir(yf_path)
                with open(f, "w") as y_file:
                    y_file.write(yaml.dump(yml_file, default_flow_style=False))
                print("Updated file: {}".format(f))
        print("Volumes updated with correct paths")

    def aws_setup(self):
        aws_conf =


    def check_dir(self, path):
        if not os.path.exists(path):
            os.mkdir(path)


def main(argv):
    valid_deploys = ("local", "aws", "azure")
    try:
        opts, args = getopt.getopt(argv, "hd", ["help", "deploy"])
    except getopt.GetoptError:
        show_help()
        sys.exit(2)
    if len(opts) == 0:
        show_help()
    for opt in opts:
        if opt[0] in ["-h", "--help"]:
            show_help()
            sys.exit(2)
        elif opt[0] in ["-d", "--deploy"]:
            i = args[0]
            if i in valid_deploys:
                KubeSetup(i)
    sys.exit(2)


def show_help():
    print('QED Kubernetes Setup Script')
    print('Description: Updates the qed_kube deploy for the specified environment.')
    print('Valid environments (deploys): "local", "aws", "azure')
    print("Usage: python qed_kube_setup.py [-h | --help] [-d <deploy> | --deploy <deploy>]")


if __name__ == "__main__":
    main(sys.argv[1:])
