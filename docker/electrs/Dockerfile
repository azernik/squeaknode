FROM rust:1.44.1-slim-buster

RUN apt-get update \
  && apt-get install -y --no-install-recommends clang=1:7.* cmake=3.* \
     libsnappy-dev=1.* \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y \
	git

RUN adduser --disabled-login --system --shell /bin/false --uid 1000 user

USER user
WORKDIR /home/user

RUN git clone https://github.com/romanz/electrs.git .
RUN cargo build --release
RUN cargo install --path .

# Electrum RPC
EXPOSE 50001

# Prometheus monitoring
EXPOSE 4224

STOPSIGNAL SIGINT

# Copy the entrypoint script.
USER root
COPY "docker/electrs/start-electrs.sh" .
RUN chmod +x start-electrs.sh
