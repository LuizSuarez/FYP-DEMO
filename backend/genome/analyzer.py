# genome/analyzer.py
import argparse
import json
import math
from collections import Counter, defaultdict

try:
    from Bio import SeqIO
except ImportError as e:
    raise SystemExit("BioPython not installed. Install with: pip install biopython")

NUCS = set(list("ACGTacgt"))

def load_sequences(path):
    seqs = []
    for rec in SeqIO.parse(path, "fasta"):
        seqs.append(str(rec.seq))
    return seqs

def clean_seq(s):
    # Keep only A,C,G,T; upper-case
    return "".join([c for c in s.upper() if c in "ACGT"])

def gc_content(seq):
    if not seq:
        return 0.0
    g = seq.count("G")
    c = seq.count("C")
    return 100.0 * (g + c) / len(seq)

def at_gc_ratio(seq):
    if not seq:
        return None
    a = seq.count("A")
    t = seq.count("T")
    g = seq.count("G")
    c = seq.count("C")
    denom = (g + c) or 1
    return (a + t) / denom

def codon_usage(seq):
    # frame 0 codons
    n = (len(seq) // 3) * 3
    codons = [seq[i:i+3] for i in range(0, n, 3)]
    counts = Counter(codons)
    total = sum(counts.values()) or 1
    freqs = {k: counts[k] / total for k in sorted(counts.keys())}
    return counts, freqs

def plotly_pie_atgc(seq):
    a = seq.count("A"); t = seq.count("T"); g = seq.count("G"); c = seq.count("C")
    return {
        "data": [{
            "type": "pie",
            "labels": ["A", "T", "G", "C"],
            "values": [a, t, g, c],
            "hole": 0.3
        }],
        "layout": {
            "title": "AT/GC Composition",
            "legend": {"orientation": "h"}
        }
    }

def plotly_bar_codon_top(freqs, top=25):
    items = sorted(freqs.items(), key=lambda x: x[1], reverse=True)[:top]
    labels = [k for k, _ in items]
    values = [v for _, v in items]
    return {
        "data": [{
            "type": "bar",
            "x": labels,
            "y": values
        }],
        "layout": {
            "title": f"Top {top} Codons by Frequency (frame 0)",
            "xaxis": {"title": "Codon"},
            "yaxis": {"title": "Frequency"}
        }
    }

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", required=True, help="FASTA file path")
    args = ap.parse_args()

    seqs_raw = load_sequences(args.input)
    seqs = [clean_seq(s) for s in seqs_raw if s]

    concatenated = "".join(seqs)
    length = len(concatenated)

    gc = gc_content(concatenated)
    ratio = at_gc_ratio(concatenated)
    codon_counts, codon_freqs = codon_usage(concatenated)

    result = {
        "meta": {
            "sequenceCount": len(seqs),
            "totalLength": length
        },
        "metrics": {
            "gc_percent": gc,                # 0-100
            "at_gc_ratio": ratio,            # (A+T)/(G+C)
        },
        "codon": {
            "counts": codon_counts,
            "frequencies": codon_freqs
        },
        "charts": {
            "atgc_pie": plotly_pie_atgc(concatenated),
            "codon_bar_top": plotly_bar_codon_top(codon_freqs, top=25)
        },
        "summary": f"GC%={gc:.2f}, AT/GC={ratio:.3f}, length={length}, sequences={len(seqs)}"
    }

    print(json.dumps(result))

if __name__ == "__main__":
    main()
