"""Generic repository base (Repository Pattern)."""

from typing import Generic, List, Optional, Type, TypeVar

from sqlalchemy.orm import Session

from backend.app.database import Base

ModelT = TypeVar("ModelT", bound=Base)


class BaseRepository(Generic[ModelT]):
    """CRUD helpers — no business logic."""

    def __init__(self, model: Type[ModelT], db: Session):
        self.model = model
        self.db = db

    def get(self, id: int) -> Optional[ModelT]:
        return self.db.get(self.model, id)

    def list(self, skip: int = 0, limit: int = 100) -> List[ModelT]:
        return self.db.query(self.model).offset(skip).limit(limit).all()

    def count(self) -> int:
        return self.db.query(self.model).count()

    def create(self, obj: ModelT) -> ModelT:
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def delete(self, obj: ModelT) -> None:
        self.db.delete(obj)
        self.db.commit()
