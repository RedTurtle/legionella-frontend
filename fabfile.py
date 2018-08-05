# -*- coding: utf-8 -*-
# Continuous delivery scripts
from fabric.api import env, local, run, cd
from fabric.context_managers import settings
from fabric.contrib import files
from fabric.operations import put
import os
import json

env.user = os.environ.get('STAGUSER')
env.hosts = [os.environ.get('STAGHOST')]
version = json.load(open('./package.json'))['version']
env.buildfilename = 'legionella-frontend-{}.tar.gz'.format(version)
env.buildfilepath = '/opt/legionella/auto-builds/'
env.root = '/opt/legionella/legionella-backend'


def build():
    local('yarn build')
    local('tar czf {} build'.format(env.buildfilename))


def upload():
    put(env.buildfilename, env.buildfilepath)


def deploy_staging():
    with cd(env.buildfilepath):
        run('tar xzf {}{}'.format(env.buildfilepath, env.buildfilename))
        target = '{}/legionella/frontend/'.format(env.root)
        if files.exists('{}build'.format(target)):
            run('rm -r {}build'.format(target))
        run('mv build {}'.format(target))
    with cd(env.root):
        with settings(prompts={
            "Type 'yes' to continue, or 'no' to cancel: ": 'yes'
        }):
            run('./deploydjangostaging')
