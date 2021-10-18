FROM daskdev/dask:2021.6.1

RUN apt update -y
RUN apt install firefox-esr git build-essential python3-dev libpq-dev -y && \
    pip install -U pip
RUN conda create -n pyenv -y python=3.8.10
COPY dask_requirements.txt /tmp
RUN conda install -n pyenv -c conda-forge scipy
RUN cd /tmp && git clone -b dev https://github.com/quanted/requirements_qed.git && \
    conda run -n pyenv --no-capture-output pip install --force-reinstall -r requirements_qed/requirements.txt
# RUN pip install --force-reinstall msgpack==0.6.2
# RUN conda install -c conda-forge numpy
SHELL ["conda", "run", "-n", "pyenv", "/bin/bash", "-c"]

ENV PATH "/src/qed:/src/qed/flask_qed:${PATH}" 
ENV PYTHONPATH "/src/qed:/src/qed/flask_qed:${PYTHONPATH}" 

CMD ["conda", "run", "-n", "pyenv", "--no-capture-output", "dask-worker", "dask-scheduler:8786"]
