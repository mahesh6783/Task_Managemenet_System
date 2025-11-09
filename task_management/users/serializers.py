from rest_framework import serializers
from .models import Login, Task   
from django.contrib.auth.hashers import make_password, check_password

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields = ['id', 'username', 'email', 'password', 'phone', 'role', 'profile_picture']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = validated_data['password']
        return super(LoginSerializer, self).create(validated_data)

class InternSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields = ['id', 'username', 'email', 'profile_picture']


class TaskSerializer(serializers.ModelSerializer):
    assigned_to = serializers.CharField(source='assigned_user.username', read_only=True)
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'deadline', 'status', 'assigned_to', 'created_by_name', 'created_at']

class ProfileUpdateSerializer(serializers.ModelSerializer):
    new_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Login
        fields = ["username", "email", "phone", "profile_picture", "new_password"]

    def update(self, instance, validated_data):
         
        new_pass = validated_data.pop("new_password", None)
        if new_pass:
            instance.password = new_pass   
 
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance



class InternListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields = ["id", "username"]

class InternDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields = ["id", "username", "email", "phone", "profile_picture"]

# class TaskSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Task
#         fields = ["id", "title", "description"]

class AdminDashboardData(serializers.ModelSerializer):
    admin_count = serializers.SerializerMethodField()
    manager_count = serializers.SerializerMethodField()
    intern_count = serializers.SerializerMethodField()

    class Meta:
        model = Login
        fields = [
            'admin_count',
            'manager_count',
            'intern_count'
        ]

    def get_admin_count(self, obj):
        return Login.objects.filter(role='admin').count()

    def get_manager_count(self, obj):
        return Login.objects.filter(role='manager').count()

    def get_intern_count(self, obj):
        return Login.objects.filter(role='intern').count()


class AdminDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields = ["id", "username", "email", "phone"]