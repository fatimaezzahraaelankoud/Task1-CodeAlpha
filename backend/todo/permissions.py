from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Les méthodes SAFE (GET, HEAD, OPTIONS) sont autorisées pour tous
        if request.method in permissions.SAFE_METHODS:
            return True
        # Sinon, seule la personne propriétaire peut modifier/supprimer
        return obj.user == request.user