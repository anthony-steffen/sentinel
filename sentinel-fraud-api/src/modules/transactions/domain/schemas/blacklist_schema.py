from uuid import UUID

from pydantic import BaseModel

from src.modules.transactions.domain.enums.blacklist_type_enums import (
    BlacklistType,
)


class CreateBlacklistRequest(
    BaseModel,
):
    value: str
    type: BlacklistType
    reason: str


class BlacklistResponse(
    BaseModel,
):
    id: UUID
    value: str
    type: BlacklistType
    reason: str

    class Config:
        from_attributes = True
