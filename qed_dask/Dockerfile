FROM daskdev/dask:2.10.1

RUN apt update && apt install firefox-esr -y
  
RUN pip install selenium matplotlib pymongo distributed bokeh==0.13 cloudpickle==1.3.0 numpy==1.18.1

CMD ["dask-worker", "dask_scheduler:8786"]
