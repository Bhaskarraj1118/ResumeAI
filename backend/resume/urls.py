
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('ats-check/', views.ats_check, name='ats_check'),
    path('job-match/', views.job_match, name='job_match'),
]
