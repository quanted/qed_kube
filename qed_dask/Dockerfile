FROM daskdev/dask:2.10.1

RUN apt update -y && \
    apt install firefox-esr git build-essential python3-dev libpq-dev -y && \
    pip install -U pip
COPY dask_requirements.txt /tmp
RUN cd /tmp && git clone -b dev https://github.com/quanted/requirements_qed.git && \
    pip install --upgrade -r requirements_qed/requirements.txt
#RUN pip install --force-reinstall msgpack==0.6.2
RUN conda install -c conda-forge scipy
RUN conda install -c conda-forge numpy

ENV PATH "/src/qed:/src/qed/flask_qed:${PATH}" 
ENV PYTHONPATH "/src/qed:/src/qed/flask_qed:${PYTHONPATH}" 

CMD ["dask-worker", "dask_scheduler:8786"]
