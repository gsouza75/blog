{% extends 'layout.swig' %}

{% block title %}An Error Occurred{% endblock %}

{% block content %}
  <h1>{{ status }}</h1>
  <h2>{{ message }}</h2>
{% endblock %}
