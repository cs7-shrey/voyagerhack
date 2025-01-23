from google.ai.generativelanguage_v1beta.types import content


mapping = {
    int: content.Type.INTEGER,
    str: content.Type.STRING,
    bool: content.Type.BOOLEAN,
    list: content.Type.ARRAY
}