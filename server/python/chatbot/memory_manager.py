# memory_manager.py

class MemoryManager:
    def __init__(self):
        self.user_context = {}

    def update_context(self, user_id, key, value):
        if user_id not in self.user_context:
            self.user_context[user_id] = {}
        self.user_context[user_id][key] = value

    def get_context(self, user_id):
        return self.user_context.get(user_id, {})

    def format_context(self, user_id):
        context = self.get_context(user_id)
        return "\n".join([f"{k}: {v}" for k, v in context.items()])
