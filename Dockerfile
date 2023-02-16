FROM python:3.10-slim
RUN mkdir api
WORKDIR /api
COPY main.py Pipfile Pipfile.lock ./
RUN pip install pipenv
RUN pipenv install
EXPOSE 8000
CMD pipenv run uvicorn main:app --host 0.0.0.0 --port 8000

