FROM daskdev/dask:2.10.1

RUN apt update && apt install firefox-esr git -y
RUN cd /tmp && git clone -b dev https://github.com/quanted/requirements_qed.git && \
    pip install -r requirements.txt

CMD ["dask-worker", "dask_scheduler:8786"]
