from django.db import models


class OrgScopedModel(models.Model):
    """
    Abstract base for all tenant-scoped models. Constitution Principle I.
    Every concrete subclass MUST be queried with .filter(org=request.org).
    The FK enforces the structural relationship; view filtering enforces access control.
    """

    org = models.ForeignKey(
        'orgs.Organization',
        on_delete=models.CASCADE,
        db_index=True,
    )

    class Meta:
        abstract = True
