from rest_framework import serializers


class BaseSerializer(serializers.ModelSerializer):
    def get_current_user(self):
        return (
            self.context.get("request").user
            if self.context.get("request") and self.context.get("request").user.is_authenticated
            else None
        )
