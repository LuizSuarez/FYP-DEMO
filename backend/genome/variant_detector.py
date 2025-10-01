#!/usr/bin/env python3
import sys
import json
import os

def parse_vcf(fileId):
    variants = []
    has_annotation = False
    with open(fileId, "r") as f:
        for line in f:
            if line.startswith("#"):
                if "ANN=" in line or "CSQ=" in line:
                    has_annotation = True
                continue

            parts = line.strip().split("\t")
            if len(parts) < 8:
                continue

            chrom, pos, vid, ref, alt, qual, flt, info = parts[:8]

            # Determine variant type
            if len(ref) == 1 and len(alt) == 1:
                var_type = "SNP"
            elif len(ref) < len(alt):
                var_type = "Insertion"
            elif len(ref) > len(alt):
                var_type = "Deletion"
            else:
                var_type = "Complex"

            # Determine zygosity
            genotype = "unknown"
            if len(parts) > 9:
                format_fields = parts[8].split(":")
                sample_fields = parts[9].split(":")
                if "GT" in format_fields:
                    gt_index = format_fields.index("GT")
                    gt = sample_fields[gt_index]
                    if gt in ["0/0", "1/1"]:
                        genotype = "homozygous"
                    elif gt in ["0/1", "1/0"]:
                        genotype = "heterozygous"

            # Parse annotation if available
            effect = None
            impact = None
            if has_annotation:
                if "ANN=" in info:
                    ann_field = [f for f in info.split(";") if f.startswith("ANN=")]
                    if ann_field:
                        annotations = ann_field[0][4:].split(",")
                        if annotations:
                            fields = annotations[0].split("|")
                            if len(fields) > 2:
                                effect = fields[1]
                                impact = fields[2]
                elif "CSQ=" in info:
                    csq_field = [f for f in info.split(";") if f.startswith("CSQ=")]
                    if csq_field:
                        annotations = csq_field[0][4:].split(",")
                        if annotations:
                            fields = annotations[0].split("|")
                            if len(fields) > 1:
                                effect = fields[0]
                                if len(fields) > 2:
                                    impact = fields[2]

            variants.append({
                "chrom": chrom,
                "pos": int(pos),
                "id": vid,
                "ref": ref,
                "alt": alt,
                "type": var_type,
                "genotype": genotype,
                "effect": effect,
                "impact": impact
            })

    # Sort variants by chromosome and position
    def chrom_key(c):
        try:
            return int(c)
        except ValueError:
            return float('inf')  # non-numeric chromosomes at the end

    variants.sort(key=lambda v: (chrom_key(v["chrom"]), v["pos"]))
    return variants, has_annotation

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input file"}))
        sys.exit(1)

    fileId = sys.argv[1]
    if not os.path.exists(fileId):
        print(json.dumps({"error": "File not found"}))
        sys.exit(1)

    ext = os.path.splitext(fileId)[1].lower()
    result = {}

    if ext == ".vcf":
        variants, has_annotation = parse_vcf(fileId)

        summary = {
            "total_variants": len(variants),
            "snp": sum(1 for v in variants if v["type"] == "SNP"),
            "insertions": sum(1 for v in variants if v["type"] == "Insertion"),
            "deletions": sum(1 for v in variants if v["type"] == "Deletion"),
            "homozygous": sum(1 for v in variants if v["genotype"] == "homozygous"),
            "heterozygous": sum(1 for v in variants if v["genotype"] == "heterozygous")
        }

        if not has_annotation:
            summary["note"] = "No ANN/CSQ fields found. Run annotation module (e.g. SnpEff, VEP) for missense/nonsense classification."

        result = {
            "summary": summary,
            "variants_preview": variants[:50]  # first 50 variants for better visibility
        }
    else:
        result = {"message": f"Variant detection not implemented for {ext}"}

    print(json.dumps(result))

if __name__ == "__main__":
    main()
