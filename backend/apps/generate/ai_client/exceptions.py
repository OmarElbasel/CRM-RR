class AIResponseParseError(Exception):
    """Raised when the AI response fails JSON/Pydantic validation after retry."""
    pass


class AIProviderUnavailableError(Exception):
    """Raised when the AI provider returns a transport-level error."""
    pass