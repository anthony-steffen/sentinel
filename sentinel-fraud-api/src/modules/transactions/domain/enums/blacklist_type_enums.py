from enum import Enum


class BlacklistType(str, Enum):
    IP = "IP"

    DEVICE = "DEVICE"
