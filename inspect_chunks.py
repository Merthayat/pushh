import struct

def inspect_chunks(filename):
    with open(filename, 'rb') as f:
        data = f.read()
    pos = 8
    print(filename, 'total:', len(data))
    while pos < len(data):
        chunk_len = struct.unpack('>I', data[pos:pos+4])[0]
        chunk_type = data[pos+4:pos+8]
        print('Chunk:', chunk_type, 'len:', chunk_len)
        pos += 12 + chunk_len
        if chunk_type == b'IEND':
            break

inspect_chunks('public/par3.png')
