#
# Copyright (c) 2016-present Invertase Limited
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this library except in compliance with the License.
# You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FROM node:lts-alpine3.13
RUN npm install pm2 -g

ARG ROOT_DIR=default_value
ARG BUILD_SHA=default_value
ENV __BUILD_SHA=$BUILD_SHA
ENV __ROOT_DIR=api

WORKDIR /opt/app
COPY . /opt/app
RUN cd /opt/app && yarn install
RUN node node_modules/esbuild/install.js

WORKDIR /opt/app/$__ROOT_DIR
CMD ["pm2-runtime","dist/app.js"]
