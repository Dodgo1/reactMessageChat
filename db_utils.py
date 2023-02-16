def add_message(field, n):
    def transform(doc):
        doc[field].append(n)

    return transform
