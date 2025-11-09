from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from .models import Login,Task,ChatMessage
from .serializers import LoginSerializer
from rest_framework import status, permissions

from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.generics import DestroyAPIView

from .serializers import LoginSerializer, TaskSerializer
from .serializers import ProfileUpdateSerializer,InternSerializer

from .serializers import InternListSerializer, InternDetailSerializer,AdminDashboardData,AdminDetailSerializer

from transformers import AutoTokenizer, AutoModelForQuestionAnswering
import torch
from transformers import pipeline


from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter


class InternDashboardView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != 'intern':
            return Response({"error": "Access denied"}, status=403)

        tasks = Task.objects.filter(assigned_user=user).order_by('-created_at')
        serializer = TaskSerializer(tasks, many=True)
        pending_count = Task.objects.filter(status="pending").count()


        return Response({
            "username": user.username,
            "role": user.role,
            "tasks": serializer.data,
            "pending_count":pending_count,
            "profile_picture": request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None,
        })



class UpdateTaskStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=404)

        new_status = request.data.get("status")

        if new_status not in ["pending", "in_progress", "completed"]:
            return Response({"error": "Invalid status"}, status=400)

        task.status = new_status
        task.save()

        return Response({"message": "Task status updated successfully"})


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "username": user.username,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "profile_picture": request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None,
        })

class ProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ProfileUpdateSerializer(
            request.user,
            data=request.data,
            partial=True     
        )

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated successfully"})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)







#  manager view=========================

class ManagerDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request): 
        interns = Login.objects.filter(role='intern')
        intern_serializer = InternSerializer(interns, many=True)

     
        tasks = Task.objects.filter(created_by=request.user)
        summary = {
            "pending": tasks.filter(status="pending").count(),
            "in_progress": tasks.filter(status="in_progress").count(),
            "completed": tasks.filter(status="completed").count(),
        }

        return Response({
            "interns": intern_serializer.data,
            "summary": summary
        })

class AssignTaskView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        title = request.data.get("title")
        description = request.data.get("description", "")
        assigned_user_id = request.data.get("assigned_user")
        deadline = request.data.get("deadline")

        try:
            assigned_user = Login.objects.get(id=assigned_user_id, role='intern')
            task = Task.objects.create(
                title=title,
                description=description,
                assigned_user=assigned_user,
                deadline=deadline,
                created_by=request.user
            )
            return Response({"message": "✅ Task assigned successfully!"}, status=status.HTTP_201_CREATED)
        except Login.DoesNotExist:
            return Response({"error": "Invalid intern ID"}, status=status.HTTP_400_BAD_REQUEST)

class TaskSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, intern_id=None):
        if intern_id:
            tasks = Task.objects.filter(assigned_user_id=intern_id)
        else:
            tasks = Task.objects.all()

        summary = {
            "pending": tasks.filter(status="pending").count(),
            "in_progress": tasks.filter(status="in_progress").count(),
            "completed": tasks.filter(status="completed").count(),
        }
        return Response(summary)



class InternList(APIView):
    def get(self, request):
        interns = Login.objects.filter(role="intern")
        return Response(InternListSerializer(interns, many=True).data)

class InternDetailsTasks(APIView):
    def get(self, request, intern_id):
        intern = Login.objects.get(id=intern_id)
        manager = request.user

        tasks = Task.objects.filter(created_by_id=manager.id, assigned_user=intern)
 
        profile_pic_url = (
            request.build_absolute_uri(intern.profile_picture.url)
            if intern.profile_picture
            else None
        )
 
        intern_data = InternDetailSerializer(intern).data
        intern_data["profile_picture1"] = profile_pic_url

        return Response({
            "intern": intern_data,
            "tasks": TaskSerializer(tasks, many=True).data
        })


class TaskDeleteAPI(DestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class ManagerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "username": user.username,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "profile_picture": request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None
        })

class ManagerProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ProfileUpdateSerializer(
            request.user,
            data=request.data,
            partial=True 
        )

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated successfully"})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






# admin===========


class AdminDashboardView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != 'admin':
            return Response({"error": "Access denied"}, status=403)

        profile_pic_url = (
            request.build_absolute_uri(user.profile_picture.url)
            if user.profile_picture
            else None
        )

      
        admin_data = AdminDetailSerializer(user).data
        admin_data["profile_picture"] = profile_pic_url

       
        serializer1 = AdminDashboardData(request.user)
         

        print(admin_data)
        return Response({
            "profile":admin_data,
            "summary": serializer1.data,
           
        })
        

class AdminAddUser(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
  
    def post(self, request):
        
        data = request.data
       
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        phone = data.get("phone")
        role = data.get("role")

        if Login.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=400)

        if Login.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=400)

        user = Login.objects.create(
            username=username,
            email=email,
            password=password,
            phone=phone,
            role=role,
        )

        return Response({"message": "User created", "user_id": user.id}, status=201)

class UserListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
  
    def get(self, request, role):
        users = Login.objects.filter(role=role)

        result = []

        for user in users:
            profile_pic_url = (
                request.build_absolute_uri(user.profile_picture.url)
                if user.profile_picture
                else None
            )

            result.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "phone": user.phone,
                "role": user.role,
                "profile_picture": profile_pic_url
            })

        return Response({"users": result}, status=200)


class DeleteUser(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            user = Login.objects.get(id=id)
            user.delete()
            return Response({"message": "User deleted"})
        except Login.DoesNotExist:
            return Response({"error": "Not found"}, status=404)

# ----------------------------
# Register View
# ----------------------------









class RegisterView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ----------------------------
# Login View
# ----------------------------
class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = Login.objects.get(email=email)
        except Login.DoesNotExist:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

        if password == user.password:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)



class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error": "Invalid token or already blacklisted"}, status=status.HTTP_400_BAD_REQUEST)



# chat boat=========================

class botprofile(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "username": user.username,
            "role": user.role,
           
            "profile_picture": request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None,
        })



llm = pipeline(
    "text2text-generation",
    model="google/flan-t5-base"
)

class ChatbotView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user_message = request.data.get("message")

        if not user_message:
            return Response({"error": "Message required"}, status=400)
 
        ChatMessage.objects.create(user=user, role="user", message=user_message)
 
        prompt = f"""
Legal Question: {user_message}

As an legal assistant, respond in EXACT format below
without repeating or restating the question.

Format:
Answer: (Yes/No)
Reason: (Short and simple explanation based on Indian law)

Give only the answer and reason.
"""

        output = llm(prompt, max_length=250)
        reply = output[0]["generated_text"].strip()
 
        ChatMessage.objects.create(user=user, role="bot", message=reply)

        return Response({"reply": reply})



class DownloadChatPDF(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user 
        messages = ChatMessage.objects.filter(user=user).order_by("created_at")

 
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="chat_history.pdf"'
 
        p = canvas.Canvas(response, pagesize=letter)
        width, height = letter

        y = height - 50
        p.setFont("Helvetica", 12)

        p.drawString(50, y, f"Chat History for {user.username}")
        y -= 30

        for msg in messages:
            line = f"{msg.created_at.strftime('%d-%m-%Y %I:%M %p')}   {msg.role.upper()}: {msg.message}"
 
            if y < 50:
                p.showPage()
                p.setFont("Helvetica", 12)
                y = height - 50

            p.drawString(50, y, line)
            y -= 20

        p.showPage()
        p.save()

        return response