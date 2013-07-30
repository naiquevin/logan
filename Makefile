
runserver:
	python app.py


runcelery:
	celery -A tasks worker --loglevel=INFO
