from tree_sitter import Language, Parser
import tree_sitter_cpp as tscpp
import sys
from pathlib import Path

STD_TYPES = [
    "size_t",
    "int",
    "float",
    "double",
    "bool",
    "char",
    "short",
    "long",
    "unsigned int",
    "unsigned char",
    "unsigned short",
    "unsigned long",
    "uint8_t",
    "uint16_t",
    "uint32_t",
    "uint64_t",
    "int8_t",
    "int16_t",
    "int32_t",
    "int64_t",
]


def get_struct_members(parser, source_code_bytes, struct_name):
    tree = parser.parse(source_code_bytes)
    root_node = tree.root_node

    def walk(node):
        for child in node.children:
            if child.type == "struct_specifier":
                # Get the struct name
                name_node = child.child_by_field_name("name")
                if (
                    name_node
                    and source_code_bytes[
                        name_node.start_byte : name_node.end_byte
                    ].decode()
                    == struct_name
                ):
                    # Found the target struct
                    field_decls = []
                    body_node = child.child_by_field_name("body")
                    for body_child in body_node.children:
                        if body_child.type == "field_declaration":
                            # Extract type and name
                            type_node = body_child.child_by_field_name("type")
                            name_node = body_child.child_by_field_name("declarator")
                            if type_node and name_node:
                                type_str = source_code_bytes[
                                    type_node.start_byte : type_node.end_byte
                                ].decode()
                                name_str = source_code_bytes[
                                    name_node.start_byte : name_node.end_byte
                                ].decode()
                                field_decls.append((type_str.strip(), name_str.strip()))
                    return field_decls
            else:
                result = walk(child)
                if result:
                    return result
        return None

    return walk(root_node)


def main(file_path, struct_name):

    parser = Parser()
    parser.language = Language(tscpp.language())

    source_code = Path(file_path).open("rb").read()

    members = get_struct_members(parser, source_code, struct_name)

    if members is None:
        print(f"Struct '{struct_name}' not found.")
    else:
        print(f"Struct '{struct_name}' has the following members:")
        for t, n in members:
            if t in STD_TYPES:
                print(f"  {t} {n}")
            else:
                print(f"  {t}(struct) {n}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python extract_struct_shape.py <file.cpp> <StructName>")
        sys.exit(1)

    main(sys.argv[1], sys.argv[2])
