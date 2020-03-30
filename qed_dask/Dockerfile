FROM daskdev/dask:2.10.1

RUN apt update -y && \
    apt install firefox-esr git build-essential python3-dev libpq-dev -y && \
    pip install -U pip
COPY dask_requirements.txt /tmp
RUN cd /tmp && git clone -b dev https://github.com/quanted/requirements_qed.git && \
    pip install -r requirements_qed/requirements.txt && \
    pip install -r dask_requirements.txt

CMD ["dask-worker", "dask_scheduler:8786"]
