 
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from users.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', RegisterView.as_view() ),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view(), ),
    path('api/intern/dashboard/', InternDashboardView.as_view(), ),
    path("task/<int:task_id>/update-status/", UpdateTaskStatusView.as_view()),
    path("api/intern/profile/", ProfileView.as_view()),
    path("api/intern/profile/update/",ProfileUpdateView.as_view()),
     

    path('api/manager/dashboard/', ManagerDashboardView.as_view(),),
    path('api/manager/assign-task/', AssignTaskView.as_view()),
    path('api/manager/summary/', TaskSummaryView.as_view()),
    path('api/manager/summary/<int:intern_id>/', TaskSummaryView.as_view()),
    path("api/interns/", InternList.as_view()),
    path("api/intern/<int:intern_id>/details/", InternDetailsTasks.as_view()),
    path("api/tasks/<int:pk>/", TaskDeleteAPI.as_view()),
    path("api/manager/profile/", ManagerProfileView .as_view()),
    path("api/manager/profile/update/", ManagerProfileUpdateView.as_view()),


    path('api/admin/dashboard/', AdminDashboardView.as_view(),),
    path('api/admin/add-user/', AdminAddUser.as_view(),),
    path("api/admin/profile/", ProfileView.as_view()),
    path("api/admin/profile/update/",ProfileUpdateView.as_view()),
    path("api/admin/users/<str:role>/", UserListView.as_view()),
    path("api/admin/delete-user/<int:id>/", DeleteUser.as_view()),

    path("api/chatbot/", ChatbotView.as_view(),  ),
    path("api/botprofile/", botprofile.as_view(),  ),
    path("api/download-chat/", DownloadChatPDF.as_view()),
]

    


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
