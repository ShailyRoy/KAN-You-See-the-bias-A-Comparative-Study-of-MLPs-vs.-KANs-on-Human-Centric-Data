let animationFrameId;

function draw() {
    const svg = d3.select('#network-svg');
    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;
    const complexity = parseInt(d3.select('#complexity-slider').node().value);
    
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    svg.selectAll('*').remove();
    
    const networkWidth = width * 0.3;
    const networkHeight = height * 0.3;
    const startX = width * 0.1;
    const startY = height * 0.2;
    const yGap = height * 0.2;
    
    const layers = complexity + 2;
    const nodesPerLayer = 4;
    const layerSpacing = networkWidth / (layers + 1);
    const nodeSpacing = networkHeight / (nodesPerLayer + 1);

    // draw mlp (unchanged)
    let mlpNodes = [];
    let mlpLinks = [];
    
    for (let i = 0; i < layers; i++) {
        for (let j = 0; j < nodesPerLayer; j++) {
            mlpNodes.push({
                layer: i,
                x: startX + layerSpacing * (i + 1),
                y: startY + nodeSpacing * (j + 1)
            });
        }
    }
    
    mlpNodes.forEach(source => {
        mlpNodes.forEach(target => {
            if (target.layer === source.layer + 1) {
                mlpLinks.push({source, target});
            }
        });
    });
    
    svg.selectAll('.mlp-link')
        .data(mlpLinks)
        .enter()
        .append('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .attr('stroke', '#8C1D40')  // asu maroon
        .attr('stroke-width', 1)
        .attr('opacity', 0.5);
    
    svg.selectAll('.mlp-node')
        .data(mlpNodes)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 4)
        .attr('fill', '#8C1D40');  // asu maroon
    
    // Draw KAN
    let kanNodes = [];
    let kanLinks = [];
    
    for (let i = 0; i < layers; i++) {
        for (let j = 0; j < nodesPerLayer; j++) {
            kanNodes.push({
                layer: i,
                x: startX + layerSpacing * (i + 1),
                y: startY + yGap + nodeSpacing * (j + 1)
            });
        }
    }
    
    kanNodes.forEach(source => {
        kanNodes.forEach(target => {
            if (target.layer === source.layer + 1) {
                kanLinks.push({source, target});
            }
        });
    });

    const lineGenerator = d3.line().curve(d3.curveBasis);
    
    const kanPaths = svg.selectAll('.kan-link')
        .data(kanLinks)
        .enter()
        .append('path')
        .attr('class', 'kan-link')
        .attr('stroke', '#FFC627')  // asu gold
        .attr('stroke-width', 1)
        .attr('fill', 'none')
        .attr('opacity', 0.5);

    svg.selectAll('.kan-node')
        .data(kanNodes)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 4)
        .attr('fill', '#FFC627');  // asu gold

    // add legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width * 0.7}, ${height * 0.3})`);

    // mlp legend
    legend.append('circle')
        .attr('r', 4)
        .attr('fill', '#8C1D40');
    legend.append('text')
        .attr('x', 10)
        .attr('y', 4)
        .text('Traditional Neural Network')
        .attr('font-size', '12px');

    // kan legend
    legend.append('circle')
        .attr('r', 4)
        .attr('cy', 20)
        .attr('fill', '#FFC627');
    legend.append('text')
        .attr('x', 10)
        .attr('y', 24)
        .text('Knowledge-Augmented Network')
        .attr('font-size', '12px');

    function updatePaths() {
        const time = Date.now() / 1000;
        
        kanPaths.each(function(d) {
            const path = d3.select(this);
            const source = d.source;
            const target = d.target;
            
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const midX = (source.x + target.x) / 2;
            const midY = (source.y + target.y) / 2;
            
            const offset1X = Math.sin(time * 2 + source.x) * 10;
            const offset1Y = Math.cos(time * 3 + source.y) * 10;
            const offset2X = Math.sin(time * 2.5 + target.x) * 10;
            const offset2Y = Math.cos(time * 3.5 + target.y) * 10;
            
            const points = [
                [source.x, source.y],
                [midX + offset1X, midY + offset1Y],
                [midX + offset2X, midY + offset2Y],
                [target.x, target.y]
            ];
            
            path.attr('d', lineGenerator(points));
        });
        
        animationFrameId = requestAnimationFrame(updatePaths);
    }

    updatePaths();
}

draw();
d3.select('#complexity-slider').on('input', draw);
