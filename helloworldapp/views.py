from django.shortcuts import render
import os


def my_view(request):
    my_env_variable = os.environ.get("MY_ENV_VARIABLE", "default_value")
    return render(request, "helloworldapp/mytemplate.html", {"my_env_variable": my_env_variable})
