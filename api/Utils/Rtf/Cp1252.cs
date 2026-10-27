using System.Collections.Generic;

namespace Api.Utils.Rtf
{
    /// <summary>
    /// Windows-1252 (the \ansicpg1252 code page the legacy VB.NET app writes) without depending on CodePagesEncodingProvider.
    /// Bytes 0x00–0x7F and 0xA0–0xFF map to the same Unicode code point; only 0x80–0x9F differ.
    /// </summary>
    public static class Cp1252
    {
        private static readonly char[] HIGH_CONTROL_RANGE =
        {
            '€', '\u0081', '‚', 'ƒ', '„', '…', '†', '‡',
            'ˆ', '‰', 'Š', '‹', 'Œ', '\u008D', 'Ž', '\u008F',
            '\u0090', '‘', '’', '“', '”', '•', '–', '—',
            '˜', '™', 'š', '›', 'œ', '\u009D', 'ž', 'Ÿ'
        };

        private static readonly Dictionary<char, byte> ENCODE_HIGH_CONTROL_RANGE = BuildEncodeMap();

        private static Dictionary<char, byte> BuildEncodeMap()
        {
            Dictionary<char, byte> map = new Dictionary<char, byte>();
            for (int i = 0; i < HIGH_CONTROL_RANGE.Length; i++)
            {
                char c = HIGH_CONTROL_RANGE[i];
                // 0x81, 0x8D, 0x8F, 0x90, 0x9D are undefined in cp1252; leave them to the \uN escape.
                if (c >= '\u0080' && c <= '\u009F') continue;
                map[c] = (byte)(0x80 + i);
            }
            return map;
        }

        /// <summary>Decodes one cp1252 byte (from an RTF \'hh escape) to its Unicode character.</summary>
        public static char Decode(byte value)
        {
            if (value >= 0x80 && value <= 0x9F) return HIGH_CONTROL_RANGE[value - 0x80];
            return (char)value;
        }

        /// <summary>Encodes a character to its cp1252 byte; returns false when cp1252 cannot represent it.</summary>
        public static bool TryEncode(char c, out byte value)
        {
            if (c < 0x80 || (c >= 0xA0 && c <= 0xFF))
            {
                value = (byte)c;
                return true;
            }
            return ENCODE_HIGH_CONTROL_RANGE.TryGetValue(c, out value);
        }
    }
}
